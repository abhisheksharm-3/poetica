import { NextResponse } from "next/server";
import crypto from "crypto";
import { headers } from "next/headers";

// Event emitter for handling SSE
import { EventEmitter } from "events";
const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(100);

type JobStatus = "pending" | "completed" | "failed";

interface Job {
  id: string;
  status: JobStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result?: any;
  error?: string;
  timestamp: number;
}

class JobStore {
  private store: Map<string, Job> = new Map();

  private cleanup() {
    const now = Date.now();
    for (const [id, job] of this.store.entries()) {
      if (now - job.timestamp > 60 * 60 * 1000) {
        this.store.delete(id);
      }
    }
  }

  createJob(id: string): Job {
    const job: Job = {
      id,
      status: "pending",
      timestamp: Date.now(),
    };
    this.store.set(id, job);
    this.cleanup();
    return job;
  }

  getJob(id: string): Job | undefined {
    return this.store.get(id);
  }

  updateJob(id: string, updates: Partial<Job>) {
    const job = this.store.get(id);
    if (job) {
      const updatedJob = { ...job, ...updates };
      this.store.set(id, updatedJob);
      eventEmitter.emit(`job-${id}`, updatedJob);
    }
  }
}

const jobStore = new JobStore();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function generatePoem(jobId: string, params: any) {
  try {
    const payload = {
      data: [
        params.style,
        params.emotionalTone,
        params.creativeStyle,
        params.languageVariety,
        params.length,
        params.wordRepetition,
      ],
    };

    const response = await fetch(`${process.env.SERVER_URI}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    jobStore.updateJob(jobId, {
      status: "completed",
      result: data.generate_poem,
    });
  } catch (error) {
    console.error("Error generating poem:", error);
    jobStore.updateJob(jobId, {
      status: "failed",
      error: "Failed to generate poem",
    });
  }
}

// Handle SSE connections
async function handleSSE(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json(
      { error: "Job ID is required" },
      { status: 400 }
    );
  }

  const job = jobStore.getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(job)}\n\n`)
      );

      const listener = (updatedJob: Job) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(updatedJob)}\n\n`)
        );

        if (
          updatedJob.status === "completed" ||
          updatedJob.status === "failed"
        ) {
          controller.close();
          eventEmitter.removeListener(`job-${jobId}`, listener);
        }
      };

      eventEmitter.on(`job-${jobId}`, listener);

      request.signal.addEventListener("abort", () => {
        eventEmitter.removeListener(`job-${jobId}`, listener);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// Handle POST requests for new poem generation
async function handlePOST(request: Request) {
  const body = await request.json();
  const {
    style,
    emotionalTone,
    creativeStyle,
    languageVariety,
    length,
    wordRepetition,
  } = body;

  const newJobId = crypto.randomBytes(16).toString("hex");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const job = jobStore.createJob(newJobId);

  generatePoem(newJobId, {
    style,
    emotionalTone,
    creativeStyle,
    languageVariety,
    length,
    wordRepetition,
  });

  return NextResponse.json({ jobId: newJobId }, { status: 202 });
}

// Main handler that routes between GET and POST
export async function GET(request: Request) {
  const headersList = await headers();
  if (headersList.get("accept") === "text/event-stream") {
    return handleSSE(request);
  }
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    if (headersList.get("accept") === "text/event-stream") {
      return handleSSE(request);
    }
    return handlePOST(request);
  } catch (error) {
    console.error("Error handling poem request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
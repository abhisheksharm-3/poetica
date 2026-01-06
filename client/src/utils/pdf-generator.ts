import jsPDF from 'jspdf';

interface PoemData {
  title?: string;
  content: string;
  prompt?: string;
  style?: string;
  emotionalTone?: string;
  createdAt?: string;
}

/**
 * Generate a beautiful PDF from poem data
 */
export const generatePoemPDF = (poem: PoemData): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - 2 * margin;

  // Background gradient simulation with rectangles
  doc.setFillColor(250, 250, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative header border
  doc.setDrawColor(100, 100, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, 20, pageWidth - margin, 20);
  doc.line(margin, 22, pageWidth - margin, 22);

  // Title "Poetica"
  doc.setFont('times', 'italic');
  doc.setFontSize(24);
  doc.setTextColor(80, 80, 150);
  doc.text('Poetica', pageWidth / 2, 35, { align: 'center' });

  // Subtitle
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text('AI-Generated Poetry', pageWidth / 2, 42, { align: 'center' });

  let yPosition = 60;

  // Poem Title
  if (poem.title) {
    doc.setFont('times', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    const titleLines = doc.splitTextToSize(poem.title, contentWidth);
    doc.text(titleLines, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += titleLines.length * 8 + 10;
  }

  // Metadata (Style & Tone)
  if (poem.style || poem.emotionalTone) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);

    let metaText = '';
    if (poem.style) metaText += `Style: ${poem.style}`;
    if (poem.emotionalTone) {
      if (metaText) metaText += ' • ';
      metaText += `Tone: ${poem.emotionalTone}`;
    }

    doc.text(metaText, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
  }

  // Decorative line before poem
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin + 20, yPosition, pageWidth - margin - 20, yPosition);
  yPosition += 10;

  // Poem Content
  doc.setFont('times', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(40, 40, 40);

  const lines = poem.content.split('\n');
  const lineHeight = 7;

  lines.forEach((line) => {
    // Check if we need a new page
    if (yPosition > pageHeight - margin - 20) {
      doc.addPage();
      yPosition = margin;
    }

    if (line.trim() === '') {
      // Empty line for stanza break
      yPosition += lineHeight / 2;
    } else {
      // Center align each line for poetic effect
      const trimmedLine = line.trim();
      const textLines = doc.splitTextToSize(trimmedLine, contentWidth - 40);
      textLines.forEach((textLine: string) => {
        doc.text(textLine, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += lineHeight;
      });
    }
  });

  yPosition += 15;

  // Decorative line after poem
  if (yPosition < pageHeight - margin - 30) {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin + 20, yPosition, pageWidth - margin - 20, yPosition);
    yPosition += 10;
  }

  // Prompt information (if available)
  if (poem.prompt && yPosition < pageHeight - margin - 20) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text('Inspired by:', margin, yPosition);
    yPosition += 5;

    const promptLines = doc.splitTextToSize(poem.prompt, contentWidth - 10);
    doc.setFont('helvetica', 'normal');
    promptLines.forEach((line: string) => {
      if (yPosition > pageHeight - margin - 10) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });
  }

  // Footer - positioned at bottom of page
  const footerY = pageHeight - 15;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);

  if (poem.createdAt) {
    doc.text(`Generated on ${poem.createdAt}`, margin, footerY);
  }

  doc.text('Created with Poetica', pageWidth - margin, footerY, { align: 'right' });

  // Decorative footer border
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

  // Save the PDF
  const fileName = poem.title
    ? `${poem.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
    : `poem_${Date.now()}.pdf`;

  doc.save(fileName);
};

/**
 * Print poem directly
 */
export const printPoem = (poem: PoemData): void => {
  // Create a hidden iframe for printing
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = 'none';

  document.body.appendChild(printFrame);

  const printDoc = printFrame.contentWindow?.document;
  if (!printDoc) return;

  // Generate print HTML
  printDoc.open();
  printDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${poem.title || 'Poem'} - Poetica</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          
          body {
            font-family: 'Georgia', 'Times New Roman', serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            color: #2a2a2a;
            background: white;
          }
          
          .header {
            text-align: center;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .brand {
            font-size: 28px;
            font-style: italic;
            color: #6366f1;
            margin-bottom: 5px;
          }
          
          .subtitle {
            font-size: 12px;
            color: #888;
            font-style: italic;
          }
          
          .poem-title {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 30px 0 10px 0;
            color: #1a1a1a;
          }
          
          .poem-meta {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-bottom: 30px;
          }
          
          .poem-content {
            font-size: 14px;
            line-height: 1.8;
            text-align: center;
            white-space: pre-wrap;
            margin: 40px 0;
            padding: 20px 40px;
          }
          
          .poem-content p {
            margin: 0.8em 0;
          }
          
          .prompt-section {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 11px;
            color: #888;
          }
          
          .prompt-label {
            font-style: italic;
            margin-bottom: 5px;
          }
          
          .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            font-size: 10px;
            color: #999;
          }
          
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">Poetica</div>
          <div class="subtitle">AI-Generated Poetry</div>
        </div>
        
        ${poem.title ? `<h1 class="poem-title">${poem.title}</h1>` : ''}
        
        ${poem.style || poem.emotionalTone ? `
          <div class="poem-meta">
            ${poem.style ? `Style: ${poem.style}` : ''}
            ${poem.style && poem.emotionalTone ? ' • ' : ''}
            ${poem.emotionalTone ? `Tone: ${poem.emotionalTone}` : ''}
          </div>
        ` : ''}
        
        <div class="poem-content">${poem.content.split('\n\n').map(stanza =>
    `<p>${stanza.replace(/\n/g, '<br>')}</p>`
  ).join('')}</div>
        
        ${poem.prompt ? `
          <div class="prompt-section">
            <div class="prompt-label">Inspired by:</div>
            <div>${poem.prompt}</div>
          </div>
        ` : ''}
        
        <div class="footer">
          ${poem.createdAt ? `Generated on ${poem.createdAt} • ` : ''}
          Created with Poetica
        </div>
      </body>
    </html>
  `);
  printDoc.close();

  // Wait for content to load then print
  printFrame.contentWindow?.focus();
  setTimeout(() => {
    printFrame.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(printFrame);
    }, 100);
  }, 250);
};

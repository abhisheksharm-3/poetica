"""
Poem formatting utilities for different poetry styles.
"""
import re
from typing import List


class PoemFormatter:
    """Handles poem formatting and title generation."""

    @staticmethod
    def format_free_verse(text: str) -> List[str]:
        """Format text as free verse poem lines."""
        lines = re.split(r"[.!?]+|\n+", text)
        lines = [line.strip() for line in lines if line.strip()]
        formatted_lines = []

        for line in lines:
            if len(line) > 40:
                parts = line.split(",")
                formatted_lines.extend(part.strip() for part in parts if part.strip())
            else:
                formatted_lines.append(line)

        return formatted_lines

    @staticmethod
    def format_haiku(text: str) -> List[str]:
        """Format text as haiku (5-7-5 syllable structure)."""
        words = text.split()
        lines: List[str] = []
        current_line: List[str] = []
        syllable_count = 0

        syllable_targets = [5, 7, 5]

        for word in words:
            if len(lines) >= 3:
                break

            syllables = len(re.findall(r"[aeiou]+", word.lower()))
            target = syllable_targets[len(lines)] if len(lines) < 3 else 5

            if syllable_count + syllables <= target:
                current_line.append(word)
                syllable_count += syllables
            else:
                if current_line:
                    lines.append(" ".join(current_line))
                current_line = [word]
                syllable_count = syllables

        if current_line and len(lines) < 3:
            lines.append(" ".join(current_line))

        return lines[:3]

    @staticmethod
    def format_sonnet(text: str) -> List[str]:
        """Format text as sonnet (14 lines, ~10 words per line)."""
        words = text.split()
        lines: List[str] = []
        current_line: List[str] = []
        target_line_length = 10

        for word in words:
            if len(lines) >= 14:
                break

            current_line.append(word)
            if len(current_line) >= target_line_length:
                lines.append(" ".join(current_line))
                current_line = []

        if current_line and len(lines) < 14:
            lines.append(" ".join(current_line))

        return lines[:14]

    @staticmethod
    def generate_title(poem_text: str) -> str:
        """Generate a title from the first key words of the poem."""
        words = poem_text.split()[:6]
        stop_words = {"the", "a", "an", "and", "or", "but", "in", "on", "at", "to"}
        key_words = [word for word in words if word.lower() not in stop_words]

        if key_words:
            return " ".join(key_words[:3]).capitalize()
        return "Untitled"

    @classmethod
    def format_poem(cls, text: str, style: str) -> List[str]:
        """Format poem based on style."""
        if style == "haiku":
            return cls.format_haiku(text)
        elif style == "sonnet":
            return cls.format_sonnet(text)
        return cls.format_free_verse(text)

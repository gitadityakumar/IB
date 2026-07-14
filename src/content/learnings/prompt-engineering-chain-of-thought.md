---
title: "Prompt engineering: chain-of-thought for complex tasks"
description: "Break hard problems into reasoning steps to improve agent output quality."
date: 2026-07-08
tags: ["ai", "prompt-engineering", "llm"]
category: "ai"
source: "claude-session-prompt42"
---

## The technique

Instead of asking for an answer directly, ask the model to think step by step.

## Example

**Weak prompt:**

> Solve this math problem.

**Strong prompt:**

> Solve this math problem. Show your reasoning step by step before giving the final answer.

## Why it works

Chain-of-thought prompting forces the model to use more computation on the problem, surface intermediate reasoning, and catch its own errors.

## Variations

- **Zero-shot CoT:** Add "Let's think step by step."
- **Few-shot CoT:** Provide examples with reasoning traces.
- **Self-consistency:** Generate multiple reasoning paths and pick the most frequent answer.

## When to use

Use CoT when tasks involve math, logic, multi-step planning, or complex decision-making.

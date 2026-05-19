"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createPresentation, type CreatePresentationState } from "../actions";

const initialState: CreatePresentationState = { error: null };

export default function NewPresentationForm() {
  const [state, action, isPending] = useActionState(createPresentation, initialState);

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">New presentation</h1>

      {state.error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <form action={action} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            autoFocus
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="My Presentation"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description{" "}
            <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          />
        </div>

        <div>
          <label
            htmlFor="deck"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Deck
          </label>
          <input
            id="deck"
            name="deck"
            type="file"
            accept=".pdf,application/pdf"
            required
            className="w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200 cursor-pointer"
          />
          <p className="mt-1.5 text-xs text-gray-400">PDF only · max 50 MB</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-gray-900 text-white px-5 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Uploading…" : "Create presentation"}
          </button>
          <Link
            href="/presentations"
            className="rounded-lg border border-gray-300 bg-white text-gray-700 px-5 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

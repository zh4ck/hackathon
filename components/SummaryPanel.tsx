export default function SummaryPanel({ summary }: { summary: string }) {
    if (!summary) return null;
    return (
      <div className="p-4 border rounded-lg bg-black-100">
        <h2 className="font-semibold mb-2">AI Summary</h2>
        <p>{summary}</p>
      </div>
    );
  }
  
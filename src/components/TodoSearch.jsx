export default function TodoSearch({ value, onChange, isSearching }) {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search todo title..."
        className="w-full rounded-lg border px-4 py-2 outline-none focus:border-green-400"
      />
      {isSearching && (
        <p className="mt-2 text-sm text-gray-500">Searching...</p>
      )}
    </div>
  );
}

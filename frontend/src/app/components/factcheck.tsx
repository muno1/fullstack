interface FactCheckProps {
  documents: { question: string; response: string }[];
}

export default function Factcheck({ documents }: FactCheckProps) {
  console.log(documents);
  return (
    <div className="border-1 p-2 rounded-sm bg-gray-100 bg-backdrop-blur overflow-hidden scrollbar-witdh-none">
      {documents.length > 0 ? (
        <ul
          className="w-19/20 space-y-5 p-3 justify-self-center max-h-120 overflow-y-scroll"
          style={{
            scrollbarWidth: "none",
          }}
        >
          {documents.map((doc, index) => (
            <li
              key={index}
              className="h-1/3 p-4 border border-gray-200 rounded-sm text-black bg-gray-50 shadow-lg"
            >
              <strong className="text-lg">{doc.question}:</strong>
              <span className="ml-2">{doc.response}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center py-4">Nessun documento disponibile</p>
      )}
    </div>
  );
}

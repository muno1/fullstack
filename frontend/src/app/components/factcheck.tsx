interface FactCheckProps {
  documents: { question: string; response: string }[];
}

export default function Factcheck({ documents }: FactCheckProps) {
  console.log(documents);
  return (
    <div className="border-1 p-2 rounded-md bg-gray-100 bg-backdrop-blur">
      <h2 className="border-1 text-xl font-bold rounded-md p-2 mb-4 bg-white">
        Fact Check:
      </h2>
      <div className="flex justify-between"></div>
      {documents.length > 0 ? (
        <ul className="w-full space-y-5 max-h-135 overflow-y-auto overflow-y-hidden overflow-y-scroll ">
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

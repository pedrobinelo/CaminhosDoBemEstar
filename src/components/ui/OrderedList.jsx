function OrderedList({ items, className = "" }) {
  if (!items || items.length === 0) return null;
  return (
    <ol className={`flex flex-col gap-3 ${className}`}>
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <span className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-purple-700 text-white font-bold text-lg flex-shrink-0">
            {idx + 1}
          </span>
          <span className="text-justify text-md/7">{item}</span>
        </li>
      ))}
    </ol>
  );
}
export default OrderedList;
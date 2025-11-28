function UnorderedList({ items, labels = {}, className = "", icon: IconComponent}) {
  if (!items || items.length === 0) return null;

  const renderIcon = () => {
    if (!IconComponent) return null;
    // Verifica se a prop passada é um Componente React (função, classe, etc.)
    if (typeof IconComponent === 'function' || typeof IconComponent === 'object') {
      return (
        <IconComponent className="text-purple-700 text-lg flex-shrink-0" size={24}/>
      );
    } 
    // Se for uma string (caractere Unicode ou texto)
    else if (typeof IconComponent === 'string') {
      return (
        <span className="text-purple-700 text-lg flex-shrink-0">
          {IconComponent}
        </span>
      );
    }
    return null; 
  };

  return (
    <ul className={`list-disc list-inside ${className} flex flex-col gap-2`}>
      {items.map((item, idx) => (
        <li key={idx} className={`text-justify ${IconComponent ? " flex items-center gap-2" : ""}`}>
          {IconComponent ? renderIcon() : null}
          {labels[item] || item}
        </li>
      ))}
    </ul>
  );
}

export default UnorderedList;


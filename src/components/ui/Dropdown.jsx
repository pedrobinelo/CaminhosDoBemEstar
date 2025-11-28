// import { useState } from "react";
import Select from "react-select";

const bgVariants = {
  primary: "#720d94",
  secondary: "#c598d4",
};

const textColors = {
  light: "#fff",
  dark: "#000",
};

function Dropdown({
  options,
  placeholderText,
  isMulti = false,
  variant = "secondary",
  textColor = "dark",
  noOptionsText = "Nenhuma opção encontrada",
  value,
  onChange
}) {
  const customStyles = {
    placeholder: (provided) => ({
      ...provided,
      color: textColors[textColor] || textColors.light,
      textAlign: "left",
      fontWeight: "bold"
    }),
    singleValue: (provided) => ({
      ...provided,
      color: textColors[textColor] || textColors.light,
      textAlign: "left",
    }),
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#d3b8db" : bgVariants[variant], // Borda mais clara ao focar
      boxShadow: state.isFocused
        ? "0 0 0 1px #d3b8db" // Sombra/Brilho de 1px com a cor de foco
        : "none", // Sem sombra quando não está focado
      backgroundColor: bgVariants[variant] || bgVariants.primary,
      cursor: "pointer",
      color: textColors[textColor] || textColors.light,
      "&:hover": {
        borderColor: "#fff",
      },
    }),
    input: (provided) => ({
      ...provided,
      color: variant === "primary" ? "#fff" : "#000",
    }),
    option: (provided, state) => ({
      ...provided,
      color: "#000",
      backgroundColor: "#FFF",
      fontWeight: state.isFocused ? "bold" : "normal",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#ce91e3",
      },
      "&:active": {
        backgroundColor: "#2b78cc",
      },
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: "#FFF", 
    //Rotacionar a seta quando o dropdown estiver aberto
      transform: state.selectProps.menuIsOpen
        ? "rotate(180deg)"
        : "rotate(0deg)",
      transition: "transform 0.3s ease",

      cursor: "pointer",
      padding: "8px", 
      "&:hover": {
        color: variant === "primary" ? "#aba7a7" : "#000"
      }
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        display: 'none', 
    }),
  };

  const renderNoOptionsMessage = () => noOptionsText;

  return (
    <div className="w-full">
      <Select
        name="filter-dropdown"
        options={options}
        placeholder={placeholderText}
        className="inter basic-multi-select"
        classNamePrefix="select"
        styles={customStyles}
        isMulti={isMulti}
        noOptionsMessage={renderNoOptionsMessage}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default Dropdown;

/**
 * Componente reutilizável para imagens com estilos padronizados.
 * @param {string} src - O caminho da imagem.
 * @param {string} alt - O texto alternativo (alt text).
 * @param {string} className - Classes Tailwind CSS extras para customização.
 */
function Image({ src, alt, className = '' }) {
    // Classes Base Padrão
    const baseClasses = "h-16 md:h-24 w-auto max-w-full object-contain";

    // Combina as classes base com as classes extras passadas via prop
    const finalClasses = `${baseClasses} ${className}`;

    return (
        <div className="flex justify-center">
            <img
                src={src}
                alt={alt}
                className={finalClasses}
            />
        </div>
    );
}

export default Image;
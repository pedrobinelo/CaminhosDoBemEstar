import { FaWindowClose } from "react-icons/fa";

function Modal({ open, title, content, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="inter bg-white rounded-lg p-6 max-w-md w-full text-black text-justify flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{title}</h2>
            <FaWindowClose className="cursor-pointer" onClick={onClose} size={25} title="Fechar"/>
        </div>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

export default Modal;
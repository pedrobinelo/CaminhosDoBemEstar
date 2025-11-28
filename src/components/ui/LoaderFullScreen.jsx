import { ClipLoader } from "react-spinners";

function LoaderFullScreen() {
  return (
    <div className="flex min-w-screen min-h-screen justify-center items-center">
      <ClipLoader color="#fff" size={64} />
    </div>
  );
}

export default LoaderFullScreen;

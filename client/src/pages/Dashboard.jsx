import { useForm } from "react-hook-form";
import { ConvertirVideo } from "../api/convertir.api";
import ClipLoader from "react-spinners/ClipLoader";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

export function Dashboard() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [conversionSuccess, setConversionSuccess] = useState(false);
  const [conversionFailed, setConversionFailed] = useState(false);
  const [mensaje, setMensaje] = useState();

  const Convertir = handleSubmit(async (data) => {
    setLoading(true);
    setConversionSuccess(false);
    try {
      const res = await ConvertirVideo(data);
      if (res.status == 200) {
        setConversionSuccess(true);
        setMensaje(res.data.message);
        setTimeout(() => {
          setConversionSuccess(false);
        }, 2500);
      }
    } catch (error) {
      setConversionFailed(true);
      setTimeout(() => {
        setConversionFailed(false);
      }, 2500);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="flex flex-col justify-center align-middle">
      <div>
        <h1 className="text-2xl font-bold text-white text-center mt-4">
          Convertidor Youtube a mp3
        </h1>
      </div>
      <div className="flex justify-center align-middle mt-10 text-white">
        <form
          className="border p-6 bg-gray-950"
          onSubmit={Convertir}
          autoComplete="off"
        >
          <label className="text-md text-white pb-3">Url De Youtube:</label>
          <input
            type="text"
            {...register("url", {
              required: "Este Campo Es Obligatorio",
              pattern: {
                value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
                message: "Ingresa una URL válida de YouTube",
              },
            })}
            className="p-2 m-2 w-full outline-none bg-transparent border-b-1 border-white shadow-sm shadow-white"
            placeholder="Url De Youtube"
          />
          {errors.url && (
            <span className="text-white text-center">{errors.url.message}</span>
          )}
          <button className="bg-white text-black p-2 mt-3 rounded-lg ml-32 w-6/12 ease-in-out duration-300 hover:bg-transparent hover:border hover:text-white">
            Convertir a mp3
          </button>
        </form>
      </div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <ClipLoader color={"#ffffff"} loading={loading} size={50} />
        </div>
      )}
      {conversionSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 fade-in">
          <FaCheckCircle className="text-green-500" size={50} />
          <p className="text-white ml-2">{mensaje}</p>
        </div>
      )}
      {conversionFailed && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 fade-in">
          <RxCrossCircled className="text-red-500" size={50} />
          <p className="text-white ml-2">Ha ocurrido un error. Intentelo de nuevo por favor</p>
        </div>
      )}
    </div>
  );
}

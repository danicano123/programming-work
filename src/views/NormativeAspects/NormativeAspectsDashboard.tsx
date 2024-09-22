import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Api } from "../../services/Api";
import Swal from "sweetalert2";

const NormativeAspectsDashboard: React.FC = () => {
  const [microsites, setMicrosites] = useState<any[]>([]);
  const auth = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMicrosites = async () => {
      try {
        const { data, statusCode } = await Api.get(
          "/normative-aspects",
          auth.data.token
        );
        if (statusCode === 200) {
          setMicrosites(data.microsites);
        } else {
          Swal.fire({
            title: "Error",
            text: `${data.message}`,
            icon: "error",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Error: unable to fetch active microsites",
          icon: "error",
        });
      }
    };

    fetchMicrosites();
  }, [auth.data.token]);

  const handleToggleIsActive = async (
    micrositeId: string,
    isActive: boolean
  ) => {
    try {
      const response = await Api.patch(
        `/microsites/${micrositeId}/is-active`,
        {
          is_active: !isActive,
        },
        auth.data.token
      );
      const { data, statusCode } = response;
      if (statusCode === 200) {
        const updatedMicrosites = microsites.map((microsite) =>
          microsite.id === micrositeId
            ? { ...microsite, is_active: !isActive }
            : microsite
        );
        setMicrosites(updatedMicrosites);
        Swal.fire({
          title: "Success",
          text: "Microsite updated successfully",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: `${data.message}`,
          icon: "error",
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">
          Tablero de Aspectos Normativos
        </h1>
        <button
          onClick={() => navigate("/create-normative-aspects")}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Crear Aspecto Normativo
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-center">Tipo</th>
            <th className="py-2 px-4 border-b text-center">Descripción</th>
            <th className="py-2 px-4 border-b text-center">Fuente</th>
            <th className="py-2 px-4 border-b text-center">Active</th>
            <th className="py-2 px-4 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {microsites.map((microsite) => (
            <tr key={microsite.id}>
              <td className="py-2 px-4 border-b text-center">
                {microsite.name}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {microsite.microsite_type}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <img
                  src={microsite.logo_url}
                  alt={microsite.name}
                  className="w-12 h-12 rounded-full"
                />
              </td>
              <td className="py-2 px-4 border-b text-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={microsite.is_active}
                    onChange={() =>
                      handleToggleIsActive(microsite.id, microsite.is_active)
                    }
                  />
                  <span>{microsite.is_active ? "Active" : "Inactive"}</span>
                </label>
              </td>
              <td className="py-2 px-4 border-b text-center space-x-4">
              <button
                  onClick={() =>
                    navigate(`/dashboard/microsites/${microsite.id}`)
                  }
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Ver detalle
                </button>
                <button
                  onClick={() =>
                    navigate(`/microsites/detail/${microsite.id}`)
                  }
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    navigate(`/dashboard/microsites/form/${microsite.id}`)
                  }
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Form
                </button>
                <button
                  onClick={() =>
                    navigate(`/dashboard/microsites/payments/${microsite.id}`)
                  }
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  View Payments
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NormativeAspectsDashboard;

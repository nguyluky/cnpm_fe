// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Api } from "../api/Api";

interface SecurityData {
  id: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  accessToken: string;
  refreshToken: string;
}

const ApiContext = createContext<{
  api: Api<SecurityData>;
  securityData: SecurityData | null | undefined;
}>(null!);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const api = useState(
    () =>
      new Api<SecurityData>({
        baseUrl: "http://localhost:3000",
        // baseUrl: 'https://api.nguyluky.site',
        securityWorker: (securityData) => {
          if (securityData && securityData.accessToken) {
            return {
              headers: {
                Authorization: `Bearer ${securityData.accessToken}`,
              },
            };
          } else {
            return {};
          }
        },
      })
  )[0];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [securityData, setSecurityData] = useState<SecurityData | null>();

  useEffect(() => {
    const oldSetSecurityData = api.setSecurityData.bind(api);
    api.setSecurityData = (data) => {
      setSecurityData(data);
      oldSetSecurityData(data);
      if (data) {
        localStorage.setItem("securityData", JSON.stringify(data));
      } else {
        localStorage.removeItem("securityData");
      }
    };

    const oldRequest = api.request;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (api as any).request = async (...args: any) => {
      try {
        return await oldRequest.apply(api, args);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("API error detected in global handler:", error);
        if (error?.status === 401 || error?.status === 403) {
          api.setSecurityData(null);
          navigate("/login");
        }
        throw error;
      }
    };

    const securedData = localStorage.getItem("securityData");
    if (securedData) {
      api.setSecurityData(JSON.parse(securedData!));
      setSecurityData(JSON.parse(securedData!));
    }
  }, []);

  return (
    <ApiContext.Provider value={{ api, securityData }}>
      {children}
    </ApiContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApi = () => {
  return useContext(ApiContext);
};

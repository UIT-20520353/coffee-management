import { Button, Modal } from "antd";
import { CircleX } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

const useHandleResponseError = () => {
  const { t } = useTranslation("error");

  const handleResponseError = useCallback(
    (error, onOk = undefined) => {
      const instance = Modal.error({
        title: (
          <span className="text-base font-bold text-red-1 font-exo-2">
            Error
          </span>
        ),
        content: (
          <span className="text-base font-exo-2">{t(error.detail)}</span>
        ),
        onOk: () => {
          instance.destroy();
          if (onOk) onOk();
        },
        centered: true,
        footer: (
          <div className="flex items-center justify-center w-full mt-3">
            <Button
              className="w-32 h-8 text-base font-medium uppercase bg-brown-1 hover:!bg-brown-3 duration-300 font-exo-2"
              type="primary"
              onClick={() => {
                instance.destroy();
                if (onOk) onOk();
              }}
            >
              OK
            </Button>
          </div>
        ),
        className: "modal--error",
        icon: <CircleX size={24} color="#da1e37" />,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return handleResponseError;
};

export default useHandleResponseError;

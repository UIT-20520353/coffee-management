import { Button, Modal } from "antd";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

const useHandleResponseError = () => {
  const { t } = useTranslation("error");

  const handleResponseError = useCallback(
    (error) => {
      const instance = Modal.error({
        title: "Error",
        content: t(error.detail),
        onOk: () => instance.destroy(),
        centered: true,
        footer: (
          <div className="flex items-center justify-center w-full">
            <Button
              onClick={() => instance.destroy()}
              className="w-32 h-8 text-base font-medium uppercase"
            >
              OK
            </Button>
          </div>
        ),
        className: "modal--error",
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return handleResponseError;
};

export default useHandleResponseError;

import React from "react";

const ReportedModal = ({
  showReportedModal,
  reportedModalMessage,
  closeReportedModal,
}: {
  showReportedModal: boolean;
  reportedModalMessage: string;
  closeReportedModal: () => void;
}) => {
  if (!showReportedModal) {
    return null;
  }

  const handleClickOutside = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      closeReportedModal();
    }
  };

  return (
    showReportedModal && (
      <div
        className={`fixed inset-0 z-50 flex justify-center rounded-lg font-bold items-center border-gray-500 "text-green-500"`}
        onClick={handleClickOutside}
      >
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <p>{reportedModalMessage}</p>
        </div>
      </div>
    )
  );
};

export default ReportedModal;

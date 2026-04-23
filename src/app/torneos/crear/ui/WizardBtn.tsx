interface BtnProps {
  handleClick: () => void;
  back: boolean;
  text: string;
  disabled?: boolean;
}

const WizardBtn = ({ handleClick, back, text, disabled }: BtnProps) => {
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`flex mt-8 mx-auto rounded px-8 py-2 font-bold justify-between text-white ${
        disabled
          ? "cursor-not-allowed bg-gray-400 hover:bg-gray-400"
          : "bg-green-500 hover:bg-green-600"
      }`}
    >
      {back ? (
        <span className="flex gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          {text}
        </span>
      ) : (
        <span className="flex gap-2">
          {text}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </span>
      )}
    </button>
  )
}

export default WizardBtn
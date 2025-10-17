type PasswordStrengthMeterProps = {
  score: number;
};

const strengthLevels = [
  { label: "", color: "bg-transparent", width: "0%" },
  { label: "Ruim", color: "bg-red-500", width: "25%" },
  { label: "Média", color: "bg-yellow-500", width: "50%" },
  { label: "Boa", color: "bg-green-500", width: "75%" },
  { label: "Ótima", color: "bg-green-600", width: "100%" },
];

const PasswordStrengthMeter = ({ score }: PasswordStrengthMeterProps) => {
  const currentLevel = strengthLevels[score];

  return (
    <div className="flex flex-col gap-2 mb-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${currentLevel.color}`}
          style={{ width: currentLevel.width }}
        ></div>
      </div>
      <p className="text-right text-sm text-gray-600">
        {currentLevel.label}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;

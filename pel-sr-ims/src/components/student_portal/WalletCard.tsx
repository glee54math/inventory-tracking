import type { Student } from "../../utils/types";

interface WalletCardProps {
  student: Student;
}

export default function WalletCard({ student }: WalletCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400">Your Balance</p>
        <p className="text-4xl font-bold text-emerald-600">{student.pelBalance ?? 0} PEL</p>
      </div>
      <div className="text-5xl">💰</div>
    </div>
  );
}

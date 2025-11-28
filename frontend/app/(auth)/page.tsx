"use client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#050509] to-[#071014] p-6">
            <div className="w-full max-w-md p-6 rounded-2xl bg-[#0e1112]/60 border border-gray-800">
                <h3 className="text-2xl font-semibold mb-4 text-center">Sign in — BWB Control</h3>
                <div className="flex flex-col gap-3">
                    <input placeholder="Email" className="bg-transparent border border-gray-700 px-3 py-2 rounded-lg" />
                    <input placeholder="Password" type="password" className="bg-transparent border border-gray-700 px-3 py-2 rounded-lg" />
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="mt-2 px-4 py-2 rounded-lg bg-emerald-600/10 text-emerald-300 hover:bg-emerald-600/20"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
}

import axios from "axios";

export const getStatus = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:5000/api/status", {
      timeout: 51000,
    });
    return res.data;
  } catch (err) {
    console.log("Fetch error:", err);
    return null;
  }
};

export const toggleAuto = async () => {
  await fetch("http://localhost:5000/api/auto/on");
};

export const manualDose = async (ammount: number) => {
  await fetch(`http://localhost:5000/api/pump/manual/${ammount}`);
};

// export const getStatus = async () => {
//   const res = await fetch("http://localhost:5000/api/status", {
//     cache: "no-store",
//   });

//   if (!res.ok) throw new Error("Server error");

//   const data = await res.json();
//   return data;
// };

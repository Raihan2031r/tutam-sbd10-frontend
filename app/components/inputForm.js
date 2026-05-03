export default function InputForm({ label, type = "text", value, onChange }) {
    return (
        <div className="relative w-full">
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder=" "
                className="peer w-full border-2 border-gray-600 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-slate-700 focus:border-2 transition-all text-gray-600 focus:text-gray-900"
            />
            <label className="
                absolute left-4 top-2.5 text-gray-600 text-sm
                transition-all duration-200 pointer-events-none
                peer-focus:-top-5.5 peer-focus:text-md peer-focus:text-slate-700
                peer-[:not(:placeholder-shown)]:-top-5.5
                peer-[:not(:placeholder-shown)]:text-xs
                peer-focus:font-bold
            ">
                {label}
            </label>
        </div>
    );
}
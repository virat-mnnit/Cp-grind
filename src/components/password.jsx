<FontAwesomeIcon icon="fa-solid fa-eye" />
import { useState } from "react";
export default function Password({ onChange, label,placeholder }) {
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);

  return (
    <div>
      <div className="text-sm font-medium text-left py-2">{label}</div>

      <input type="text" placeholder={placeholder} onChange={onChange}  className="w-full px-2 py-1 border rounded border-slate-200" />
      
      
      
      
     


    </div>
  );
}

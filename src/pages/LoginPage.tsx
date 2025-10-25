import { useNavigate } from "react-router-dom";
import { useState } from "react";
// handle login base on password 123 and username parent/driver/admin

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameFalse, setUsernameFalse] = useState(false);
  const [passwordFalse, setPasswordFalse] = useState(false);
  const handleLogin = () => {
    setUsernameFalse((username.trim() === "" ? true : false));
    setPasswordFalse((password.trim() === "" ? true : false));

    if (password !== '123') {
      setPasswordFalse(true);
    }
    else if (username === 'parent') {
      console.log('navigate to parent');

      navigate('/parent');
    }
    else if (username === 'driver') {
      navigate('/driver');
      console.log('navigate to driver');
    }
    else if (username === 'admin') {
      navigate('/admin');
      console.log('navigate to admin');
    } else {
      setUsernameFalse(true);
    }
  };

  return (
    <div className="bg-[#E0E7FF] w-full min-h-screen flex justify-center items-center mx-auto px-4 py-16">
      <div className="malign-items-center text-center x-10 flex justify-center items-center">
        <div className="rounded-xl bg-white max-w-120 p-5 shadow-2xl text-center">
          <div className="align-items-center text-center space-y-3">
            <div className="font-bold text-[30px] my-5 mb-10">Dang nhap</div>
          </div>
          <div className="flex items-center mb-4">
            <label htmlFor="username" className="w-32 text-left mb-2 font-semibold">Username</label>
            <input type="text" id="username" name="username" className="flex-1 border border-gray-300 p-2 rounded-md" onChange={(e) => setUsername(e.target.value)} placeholder="parent/driver/admin" />
          </div>
          {usernameFalse && <div className="text-red-500 mb-4">Invalid username</div>}
          <div className="flex items-center mb-4">
            <label htmlFor="password" className="w-32 text-left mb-2 font-semibold">Password</label>
            <input type="password" id="password" name="password" className="flex-1 border border-gray-300 p-2 rounded-md" onChange={(e) => setPassword(e.target.value)} placeholder="123" />
          </div>
          {passwordFalse && <div className="text-red-500 mb-4">Invalid password</div>}
          <button onClick={handleLogin} className="bg-[#111827] text-[#FFFDFD] text-[15px] font-semibold my-5 px-10 py-3 rounded-xl">Dang nhap</button>
          <div className="text-gray-500">Forgot password?</div>
        </div>
      </div>
    </div>
  );
}

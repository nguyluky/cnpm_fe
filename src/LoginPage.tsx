export function LoginPage() {

  return (
    <div className="bg-[#E0E7FF] w-full min-h-screen flex justify-center items-center mx-auto px-4 py-16">
      <div className="malign-items-center text-center x-10 flex justify-center items-center">
        <div className="rounded-xl bg-white max-w-120 p-5 shadow-2xl text-center">
          <div className="align-items-center text-center space-y-3">
            <div className="font-bold text-[30px] my-5 mb-10">Dang nhap</div>
          </div>
          <div className="flex items-center mb-4">
            <label htmlFor="username" className="w-32 text-left mb-2 font-semibold">Username</label>
            <input type="text" id="username" name="username" className="flex-1 border border-gray-300 p-2 rounded-md" />
          </div>
          <div className="flex items-center mb-4">
            <label htmlFor="password" className="w-32 text-left mb-2 font-semibold">Password</label>
            <input type="password" id="password" name="password" className="flex-1 border border-gray-300 p-2 rounded-md" />
          </div>
          <button className="bg-[#111827] text-[#FFFDFD] text-[15px] font-semibold my-5 px-10 py-3 rounded-xl">Dang nhap</button>
          <div className="text-gray-500">Forgot password?</div>
        </div>
      </div>
    </div>
  );
}

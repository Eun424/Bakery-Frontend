import bakeryImg from "../assets/images/Bakery-form.jpeg";

const AuthStructure = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="rounded-2xl flex flex-col md:flex-row overflow-hidden max-w-4xl w-full shadow-2xl bg-white">
        {/* Image Section */}
        <div className="w-full md:w-1/2 relative flex items-center justify-center p-6 bg-gray-50">
          <img
            src={bakeryImg}
            alt="Bakery"
            className="rounded-lg w-full object-cover shadow-md"
          />
        </div>

        {/* Form Section */}
        {children}
      </div>
    </div>
  );
};

export default AuthStructure;

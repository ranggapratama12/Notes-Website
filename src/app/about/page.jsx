import React from "react";
import { GraduationCap, Chrome, BookMarked, User, Mail, Github, Instagram } from "lucide-react";
// import BtnNext from "@/components/my-components/next";

const AboutPage = () => {
  return (
    <div className="min-h-screen font-sans">
      {/* Section Hero dengan Gradasi Ungu Lolipop */}
      <section 
        className="py-16 px-6 md:px-20 text-white"
        style={{
          background: 'linear-gradient(135deg, #81007F 0%, #4c1d95 30%, #1e1b4b 70%, #0f0f23 100%)'
        }}
      >
        <div className="grid md:grid-cols-2 gap-10">
          <div className="flex justify-center">
            <img
              src="/images/My profile.jpg"
              alt="Training Next Event"
              className="rounded-xl max-w-md object-cover shadow-2xl border-2 border-white/20 hover:border-purple-300 transition-all duration-300"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div>
              <User className="w-28 h-28 text-pink-300 mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase flex items-center gap-2 bg-gradient-to-r from-pink-300 to-purple-200 bg-clip-text text-transparent">
                Rangga Pratama Wibianto
              </h2>
            </div>

            <p className="text-pink-300 text-2xl leading-relaxed mb-3 font-semibold">
              Pemula Puh
            </p>
            <div className="space-y-2 mb-6">
              <p className="text-purple-100 text-sm">
                Mahasiswa Unitomo Tahun 2024 dari Fakultas Teknik Prodi Informatika Semester 2
              </p>
              <p className="text-purple-100 text-sm">
                berumur 20 tahun kelahiran TIMIKA besar di SURABAYA
              </p>
              <p className="text-purple-100 text-sm">
                Mengambil Pelatihan
                <strong className="text-pink-300"> Next.JS </strong>untuk Mengembangkan Skill
              </p>
            </div>
            
            <div className="flex gap-4 mt-6">
              <a 
                href="https://github.com/ranggapratama12" 
                className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Github size={18} />
                GitHub
              </a>
              <a 
                href="https://www.instagram.com/pratamarpw_" 
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-pink-500/25"
              >
                <Instagram size={18} />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section Training Next dengan Gradasi Ungu ke Hijau */}
      <section 
        className="py-16 px-6 md:px-20 text-white"
        style={{
          background: 'linear-gradient(135deg, #81007F 0%, #9333ea 25%, #059669 75%, #047857 100%)'
        }}
      >
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Chrome  className="w-16 h-16 text-yellow-300 drop-shadow-lg" />
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide uppercase bg-gradient-to-r from-yellow-300 to-green-300 bg-clip-text text-transparent">
              My Work Experience
            </h2>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
            <p className="text-lg mb-4 leading-relaxed"> <strong className="text-yellow-300">computer technician</strong>
            </p>
            <p className="text-lg -mt-5">-3 Month</p>
            <p className="text-sm text-green-100">
              servicing laptops & PCs, installing software, maintenance, etc.
            </p>
             <p className="text-lg mb-4 leading-relaxed"> <strong className="text-yellow-300">Store Retail</strong>
            </p>
            <p className="text-lg -mt-5">-8 Month</p>
            <p className="text-sm text-green-100">
              Carrying out responsibilities in the store
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/images/work.jpg"
              alt="Training Next"
              className="rounded-2xl w-full max-w-md object-cover shadow-2xl border-2 border-white/20 hover:border-green-300 transition-all duration-300 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Section HIMA TIFTA dengan Gradasi Light Purple */}
      <section 
        className="py-16 px-6 md:px-20"
        style={{
          background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 25%, #ddd6fe 50%, #c4b5fd 75%, #a78bfa 100%)',
          color: '#4c1d95'
        }}
      >
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <img
              src="/images/Planning-to-study-abroad.jpg"
              alt="HIMA TIFTA"
              className="rounded-2xl w-full max-w-md object-cover shadow-2xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105"
            />
          </div>
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-purple-200 hover:bg-white/80 transition-all duration-300">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase flex items-center gap-2">
              <BookMarked  className="w-8 h-8 text-green-600" />
              <span className="bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                STUDY
              </span>
            </h2>
            <p className="text-purple-800 text-lg leading-relaxed mb-3">
              - SD ( 2011 - 2017 )
            </p>
            <p className="text-purple-800 text-lg mb-3">
              - SMP ( 2017 - 2020 )
            </p>
            <p className="text-purple-800 text-lg mb-3">
              - SMK ( 2020 - 2023 )
            </p>
            <p className="text-purple-800 text-lg">
              - MAGANG ( DINAS PROV JATIM )
            </p>
          </div>
        </div>
      </section>

      {/* Optional: Fixed Navigation Button */}
      {/* <div className="fixed bottom-6 right-6 z-50">
        <BtnNext title={"kehalaman selanjutnya"} route={"/list-project"} />
      </div> */}
    </div>
  );
};

export default AboutPage;
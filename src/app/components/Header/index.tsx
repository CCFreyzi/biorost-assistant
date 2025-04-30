'use client';

import Image from 'next/image';
import { HiMapPin } from 'react-icons/hi2';
import { FaMagnifyingGlass } from 'react-icons/fa6';

const navLinks = ['Про нас', 'Продукція', 'Карти внесення', 'Новини', 'Вакансії', 'Контакти'];

export default function Header() {
    return (
        <header className="w-full text-[#222] font-sans px-5 py-2.5 absolute">
            <div className="max-w-[1220px] mx-auto">
                <div className="flex justify-between items-center flex-wrap pb-7">
                    <div className="text-xl flex items-center gap-x-2">
                        <HiMapPin />
                        вул. Сталеварів 17, Запоріжжя
                    </div>

                    <div className="mx-auto">
                        <Image src="https://biorost.ua/assets/logo-BH7nQsao.png" width={200} height={40} alt="Logo" />
                    </div>

                    <div className="text-xl text-center">
                        <a href="mailto:biorost.zap@gmail.com" className="block text-black no-underline ml-2.5 hover:text-[#2f7a2f]">
                            Biorost.zap@gmail.com
                        </a>
                        <a href="tel:+380687579303" className="block text-black no-underline ml-2.5 hover:text-[#2f7a2f]">
                            +380687579303
                        </a>
                    </div>
                </div>

                <div className="mt-2.5 flex justify-between items-center flex-wrap gap-2.5">
                    <nav className="flex flex-wrap gap-4 text-[17px]">
                        {navLinks.map((label) => (
                            <a key={label} href="#" className="no-underline text-[#333] font-medium hover:text-[#2f7a2f]">
                                {label}
                            </a>
                        ))}
                    </nav>

                    <div className="relative flex items-center w-[270px]">
                        <input type="text" placeholder="Пошук" className="pl-2.5 pr-8 py-1.5 border border-[#ccc] bg-white rounded-[12px] h-[42px] focus:outline-none focus:ring-1 focus:ring-[#2f7a2f] w-full" />
                        <FaMagnifyingGlass className="absolute right-2 text-gray-400" />
                    </div>
                </div>
            </div>
        </header>
    );
}

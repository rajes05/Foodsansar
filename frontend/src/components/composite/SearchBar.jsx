import React, { useEffect, useState } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setSearchItems } from '../../redux/userSlice';
import axios from 'axios';
import { serverUrl } from '../../App';
import levenshtein from 'fast-levenshtein'


const SearchBar = ({ currentCity, className = ''}) => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    // fetch search items
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get("q");

        // sync input with URL
        if (q) {
            setQuery(q);
        } else {
            setQuery("");
            dispatch(setSearchItems(null));
            return;
        }

        // fetch search items using q (NOT Query)
        const handleSearchItems = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/item/search-items?query=${q}&city=${currentCity}`,
                    { withCredentials: true }
                );

                // sort items by relevance
                const sorted = result.data.sort((a, b) => {
                    const distA = levenshtein.get(a.name.toLowerCase(), q.toLowerCase());
                    const distB = levenshtein.get(b.name.toLowerCase(), q.toLowerCase());
                    return distA - distB; // smaller distance = more relevance
                })

                dispatch(setSearchItems(sorted));

            } catch (error) {
                console.log(error);
            }
        };

        handleSearchItems();
    }, [location.search, currentCity]);

    return (
        // (popup/mid)
        // (w-[90%]/md:w-[60%] lg:w-[40%])
        // (flex/md:flex)
        // (fixed top-20 left-[5%] animate-[slideDown_0.5s_ease-out]/hidden)
        <div className={`h-[70px] bg-white shadow-xl rounded-lg items-center gap-5 ${className}`}>

            {/* ====== Location ===== */}
            <div className='flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-400'>

                {/* currentCity */}
                <FaLocationDot size={25} className='text-[#ff4d2d]' />
                <div className='w-[80%] truncate text-gray-600'>
                    {currentCity}
                </div>
                {/* End currentCity */}
            </div>
            {/* ====== END SEARCH BAR ===== */}

                {/* ===== Input ===== */}
                <div className='w-[80%] flex items-center gap-2.5'>

                    <IoIosSearch
                        size={25}
                        className='text-[#ff4d2d] cursor-pointer'
                        onClick={() => {
                            if (query.trim()) {
                                navigate(`/search?q=${query}`);
                            } else {
                                navigate("/")
                            }
                        }}
                    />

                    <input type="text"
                        placeholder='Search delicious food...'
                        className='px-2.5 text-gray-700 outline-0 w-full'
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                if (query.trim()) {
                                    navigate(`/search?q=${query}`)
                                } else {
                                    navigate("/");
                                }
                            }
                        }}
                    />
                </div>
                {/* ===== End input ===== */}

        </div>
    )
}
export default SearchBar;
import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav';
import { categories } from '../category';
import CategoryCard from './CategoryCard';
import { FaChevronCircleLeft } from "react-icons/fa";
import { FaChevronCircleRight } from "react-icons/fa";
import { useSelector } from 'react-redux';
import FoodCard from './FoodCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import Footer from './Footer';
import HeroSection from './HeroSection';
import BannerSlider from './BannerSlider';



function UserDashboard() {
  // to get current city from redux store
  const {currentCity, shopInMyCity, itemsInMyCity, searchItems} = useSelector(state=>state.user);

  const cateScrollRef = useRef();
  const shopScrollRef = useRef();
  const navigate=useNavigate()
  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);
   const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);
  const [updatedItemsList, setUpdatedItemsList] = useState([]);

  const handleFilterByCategory = (category)=>{
    if(category=="All"){
      setUpdatedItemsList(itemsInMyCity)
    }else{
      const filteredLIst = itemsInMyCity?.filter(i=>i.category===category)
      setUpdatedItemsList(filteredLIst)
    }
  }

  useEffect(()=>{
    setUpdatedItemsList(itemsInMyCity)
  },[itemsInMyCity])

  //handle function 
  const updateButton = (ref, setLeftButton, setRightButton)=>{
      const element = ref.current;
      if(element){
        setLeftButton(element.scrollLeft>0)
        
        // console.log("scroll Left", element.scrollLeft);
        // console.log("client Width ", element.clientWidth);
        // console.log("scroll Width", element.scrollWidth);
        setRightButton(element.scrollLeft+element.clientWidth<element.scrollWidth)
      }
  };

  const scrollHandler = (ref, direction)=>{
    if(ref.current){
      ref.current.scrollBy({
        left:direction=="left"?-200:200,
        behavior:"smooth"
      });
    }
  };

  useEffect(()=>{
      if(cateScrollRef.current){
        // for category
        updateButton(cateScrollRef,setShowLeftCateButton,setShowRightCateButton)        
        // for shop by city
        updateButton(shopScrollRef,setShowLeftShopButton,setShowRightShopButton)

        cateScrollRef.current.addEventListener('scroll', ()=>{
          // for category
          updateButton(cateScrollRef,setShowLeftCateButton,setShowRightCateButton)
        })
        shopScrollRef.current.addEventListener('scroll', ()=>{
          // for shop by city
          updateButton(shopScrollRef,setShowLeftShopButton,setShowRightShopButton)
        })

      }
      return ()=>{cateScrollRef?.current?.removeEventListener('scroll', ()=>{
          // for category
          updateButton(cateScrollRef,setShowLeftCateButton,setShowRightCateButton)
        });
                  shopScrollRef?.current?.removeEventListener('scroll', ()=>{
          // for shop by city
          updateButton(shopScrollRef,setShowLeftShopButton,setShowRightShopButton)
        })
      }
  },[categories]);

  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto pt-20'>

        <Nav/>

    {/* ======= Banner Slider ========== */}
    <div className='w-full max-w-6xl px-2.5'>
        <BannerSlider/>
    </div>
    {/* ======= End Banner Slider ======== */}

            {/* Category card  */}
        <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-2.5'>

            <h1 className='text-gray-800 text-2xl sm:text-3xl'>Popular Categories For You</h1>

            <div className='w-full relative'>

              {/* left button  */}

              {showLeftCateButton && 
              <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(cateScrollRef,"left")}>
                  <FaChevronCircleLeft />

              </button>
              }

              {/* CategoryCard  */}

              <div className='w-full flex overflow-x-auto gap-4 pb-2 ' ref={cateScrollRef}>

                {categories.map((cate, index)=>(
                  <CategoryCard name={cate.category} image={cate.image} key={index} onClick={()=>{handleFilterByCategory(cate.category)}}/>
                ))}
                
              </div>

              {/* *End CategoryCard  */}

              {/* right button  */}

              {showRightCateButton && 
              <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(cateScrollRef,"right")}>
                  <FaChevronCircleRight />

              </button>
              }

            </div>

        </div>
            {/* *End Category card  */}

            {/* Shop card */}
        <div id='shop-by-city' className='w-full max-w-6xl flex flex-col gap-5 items-start p-2.5'>

            <h1 className='text-gray-800 text-2xl sm:text-3xl'>Featured Shop's in {currentCity}</h1>

                <div className='w-full relative'>

              {/* left button  */}

              {showLeftShopButton && 
              <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(shopScrollRef,"left")}>
                  <FaChevronCircleLeft />

              </button>
              }

              {/* Shop Card  */}

              <div className='w-full flex overflow-x-auto gap-4 pb-2 ' ref={shopScrollRef}>

                {shopInMyCity?.map((shop, index)=>(
                  <CategoryCard name={shop.name} image={shop.image} key={index} onClick={()=>navigate(`/shop/${shop._id}`)}/>
                ))}
                
              </div>

              {/* *End Shop Card  */}

              {/* right button  */}

              {showRightShopButton && 
              <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(shopScrollRef,"right")}>
                  <FaChevronCircleRight />

              </button>
              }

            </div>
        </div>
              {/* *End Shop card  */}

              {/* Food Card  */}
        <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-2.5'>

              <h1 className='text-gray-800 text-2xl sm:text-3xl'>Recommend's For You</h1>

              <div className='w-full h-auto flex flex-wrap gap-5 justify-center'>
                {updatedItemsList?.map((item, index)=>(
                  <FoodCard key={index} data={item} />
                ))}
              </div>

        </div>
              {/* *End Food Card  */}

              <Footer/>
    </div>
  )
}

export default UserDashboard;
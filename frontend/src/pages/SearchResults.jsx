import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import FoodCard from '../components/FoodCard'
import { setSearchItems } from '../redux/userSlice'
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa'
import { categories } from '../category'
import Footer from '../components/Footer'

// ─── Brand ────────────────────────────────────────────────────
const PRIMARY = '#8BB844'
const ACCENT = '#E67D33'
const ITEMS_PER_PAGE = 12

// ─── Sort Options ─────────────────────────────────────────────
const SORT_OPTIONS = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Price: Low → High', value: 'price_asc' },
    { label: 'Price: High → Low', value: 'price_desc' },
    { label: 'Name: A → Z', value: 'name_asc' },
]

// ─── Pagination ───────────────────────────────────────────────
function Pagination({ total, perPage, current, onChange }) {
    const totalPages = Math.ceil(total / perPage)
    if (totalPages <= 1) return null
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    // show max 5 pages with ellipsis
    const visible = pages.filter(p =>
        p === 1 || p === totalPages || Math.abs(p - current) <= 1
    )
    return (
        <div className='flex items-center justify-center gap-1.5 mt-10 flex-wrap'>
            <button
                onClick={() => onChange(current - 1)}
                disabled={current === 1}
                className='w-9 h-9 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:border-[#E67D33] hover:text-[#E67D33] shadow-sm'
            ><FaChevronCircleLeft size={14} /></button>

            {visible.map((p, i) => {
                const prev = visible[i - 1]
                return (
                    <React.Fragment key={p}>
                        {prev && p - prev > 1 && (
                            <span className='w-9 h-9 flex items-center justify-center text-gray-400 text-sm'>…</span>
                        )}
                        <button
                            onClick={() => onChange(p)}
                            className='w-9 h-9 rounded-lg text-sm font-semibold transition-all shadow-sm'
                            style={current === p
                                ? { background: ACCENT, color: '#fff', boxShadow: `0 3px 10px ${ACCENT}44` }
                                : { background: '#fff', border: '1px solid #e5e7eb', color: '#555' }
                            }
                        >{p}</button>
                    </React.Fragment>
                )
            })}

            <button
                onClick={() => onChange(current + 1)}
                disabled={current === totalPages}
                className='w-9 h-9 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:border-[#E67D33] hover:text-[#E67D33] shadow-sm'
            ><FaChevronCircleRight size={14} /></button>
        </div>
    )
}

// ─── Collapsible Filter Section ───────────────────────────────
function FilterSection({ title, children }) {
    const [open, setOpen] = useState(true)
    return (
        <div className='border-b border-gray-100 pb-4'>
            <button
                onClick={() => setOpen(o => !o)}
                className='flex items-center justify-between w-full py-2 text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors'
            >
                {title}
                {open ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
            </button>
            {open && <div className='mt-3'>{children}</div>}
        </div>
    )
}

// ─── Price Slider ─────────────────────────────────────────────
function PriceRange({ min, max, value, onChange }) {
    return (
        <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between text-xs text-gray-500'>
                <span>Rs. {value[0]}</span>
                <span>Rs. {value[1]}</span>
            </div>
            {/* Min slider */}
            <input
                type='range' min={min} max={max} step={10}
                value={value[0]}
                onChange={e => {
                    const v = Math.min(Number(e.target.value), value[1] - 10)
                    onChange([v, value[1]])
                }}
                className='w-full h-1.5 rounded-full appearance-none cursor-pointer'
                style={{ accentColor: PRIMARY }}
            />
            {/* Max slider */}
            <input
                type='range' min={min} max={max} step={10}
                value={value[1]}
                onChange={e => {
                    const v = Math.max(Number(e.target.value), value[0] + 10)
                    onChange([value[0], v])
                }}
                className='w-full h-1.5 rounded-full appearance-none cursor-pointer'
                style={{ accentColor: ACCENT }}
            />
            <div className='flex gap-2 mt-1'>
                <input
                    type='number' value={value[0]} min={min} max={value[1] - 10}
                    onChange={e => onChange([Number(e.target.value), value[1]])}
                    className='w-full border border-gray-200 rounded-lg px-2 py-1 text-xs text-center outline-none focus:border-[#8BB844]'
                />
                <span className='text-gray-400 text-xs self-center'>—</span>
                <input
                    type='number' value={value[1]} min={value[0] + 10} max={max}
                    onChange={e => onChange([value[0], Number(e.target.value)])}
                    className='w-full border border-gray-200 rounded-lg px-2 py-1 text-xs text-center outline-none focus:border-[#8BB844]'
                />
            </div>
        </div>
    )
}

// ─── Main Search Results Page ─────────────────────────────────
function SearchResults() {
    const { searchItems, currentCity } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [sort, setSort] = useState('relevance')
    const [priceRange, setPriceRange] = useState([0, 2000])
    const [selCats, setSelCats] = useState([])
    const [page, setPage] = useState(1)
    const [mobileSidebar, setMobileSidebar] = useState(false)

    // derive max price from items
    const maxPrice = useMemo(() => {
        if (!searchItems?.length) return 2000
        return Math.ceil(Math.max(...searchItems.map(i => i.price ?? 0)) / 100) * 100 || 2000
    }, [searchItems])

    useEffect(() => {
        setPriceRange([0, maxPrice])
    }, [maxPrice])

    // reset page on filter change
    useEffect(() => { setPage(1) }, [sort, priceRange, selCats])

    const toggleCat = (cat) => {
        setSelCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
    }

    // ── Filter + Sort ────────────────────────────────────────────
    const filtered = useMemo(() => {
        if (!searchItems) return []
        let list = [...searchItems]

        // category filter
        if (selCats.length > 0) list = list.filter(i => selCats.includes(i.category))

        // price filter
        list = list.filter(i => {
            const p = i.price ?? 0
            return p >= priceRange[0] && p <= priceRange[1]
        })

        // sort
        if (sort === 'price_asc') list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
        if (sort === 'price_desc') list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
        if (sort === 'name_asc') list.sort((a, b) => a.name?.localeCompare(b.name))

        return list
    }, [searchItems, sort, priceRange, selCats])

    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    const clearAll = () => {
        setSort('relevance')
        setPriceRange([0, maxPrice])
        setSelCats([])
        setPage(1)
    }

    const activeFilters = selCats.length + (sort !== 'relevance' ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0)

    // ── Sidebar Content ──────────────────────────────────────────
    const SidebarContent = () => (
        <div className='flex flex-col gap-5'>

            {/* Clear all */}
            {activeFilters > 0 && (
                <button
                    onClick={clearAll}
                    className='text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all hover:scale-105 w-fit'
                    style={{ color: ACCENT, borderColor: `${ACCENT}44`, background: `${ACCENT}08` }}
                >
                    <FiX size={13} /> Clear all filters ({activeFilters})
                </button>
            )}

            {/* Categories */}
            <FilterSection title="Categories">
                <div className='flex flex-col gap-2'>
                    {categories.map(c => (
                        <label key={c.category} className='flex items-center gap-2.5 cursor-pointer group'>
                            <input
                                type='checkbox'
                                checked={selCats.includes(c.category)}
                                onChange={() => toggleCat(c.category)}
                                className='w-4 h-4 rounded cursor-pointer'
                                style={{ accentColor: PRIMARY }}
                            />
                            <span className='text-sm text-gray-600 group-hover:text-gray-900 transition-colors'>{c.category}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Price Range">
                <PriceRange
                    min={0}
                    max={maxPrice}
                    value={priceRange}
                    onChange={setPriceRange}
                />
            </FilterSection>

            {/* Sort (in sidebar for mobile) */}
            <FilterSection title="Sort By">
                <div className='flex flex-col gap-2'>
                    {SORT_OPTIONS.map(o => (
                        <label key={o.value} className='flex items-center gap-2.5 cursor-pointer group'>
                            <input
                                type='radio'
                                name='sort_sidebar'
                                checked={sort === o.value}
                                onChange={() => setSort(o.value)}
                                className='w-4 h-4 cursor-pointer'
                                style={{ accentColor: PRIMARY }}
                            />
                            <span className='text-sm text-gray-600 group-hover:text-gray-900 transition-colors'>{o.label}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

        </div>
    )

    //   ===== Search Result Page =====

    return (
        <div className='w-screen min-h-screen bg-[#f5f5f0] flex flex-col'>
            <Nav />

            <div className='w-full max-w-7xl mx-auto px-3 sm:px-5 pt-24 pb-14 flex flex-col gap-5'>

                {/* ── Top bar: result count + sort ── */}
                <div className='flex items-center justify-between flex-wrap gap-3'>

                    {/* Left: breadcrumb + count */}
                    <div className='flex flex-col gap-0.5'>
                       
                        <h1 className='text-base sm:text-lg font-bold text-gray-800'>
                            {filtered.length > 0
                                ? <><span style={{ color: PRIMARY }}>{filtered.length}</span> items found in <span style={{ color: ACCENT }}>{currentCity}</span></>
                                : 'No results found'
                            }
                        </h1>
                    </div>

                    {/* Right: sort dropdown + mobile filter button */}
                    <div className='flex items-center gap-2'>

                        {/* Sort dropdown — desktop */}
                        <div className='hidden sm:flex items-center gap-2'>
                            <span className='text-xs text-gray-500 whitespace-nowrap'>Sort by:</span>
                            <select
                                value={sort}
                                onChange={e => setSort(e.target.value)}
                                className='text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none cursor-pointer shadow-sm'
                                style={{ color: '#444' }}
                            >
                                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>

                        {/* Mobile filter button */}
                        <button
                            onClick={() => setMobileSidebar(true)}
                            className='sm:hidden flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border transition-all'
                            style={{ borderColor: PRIMARY, color: PRIMARY, background: `${PRIMARY}0d` }}
                        >
                            <FiFilter size={15} />
                            Filters {activeFilters > 0 && <span className='bg-[#E67D33] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>{activeFilters}</span>}
                        </button>
                    </div>
                </div>

                {/* ── Layout: sidebar + grid ── */}
                <div className='flex gap-5 items-start'>

                    {/* ── Sidebar — desktop ── */}
                    <aside className='hidden sm:flex flex-col gap-5 w-56 lg:w-64 shrink-0 bg-white rounded-2xl p-5 shadow-sm sticky top-24'>
                        <div className='flex items-center gap-2 pb-2 border-b border-gray-100'>
                            <FiFilter size={15} style={{ color: PRIMARY }} />
                            <span className='font-bold text-gray-800 text-sm'>Filters</span>
                            {activeFilters > 0 && (
                                <span
                                    className='ml-auto text-xs font-bold px-2 py-0.5 rounded-full text-white'
                                    style={{ background: ACCENT }}
                                >{activeFilters}</span>
                            )}
                        </div>
                        <SidebarContent />
                    </aside>

                    {/* ── Mobile sidebar overlay ── */}
                    {mobileSidebar && (
                        <div className='fixed inset-0 z-9999 flex sm:hidden'>
                            {/* backdrop */}
                            <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={() => setMobileSidebar(false)} />
                            {/* drawer */}
                            <div className='relative ml-auto w-[80%] max-w-xs bg-white h-full overflow-y-auto p-5 flex flex-col gap-5 shadow-2xl animate-[slideInRight_0.25s_ease-out]'>
                                <div className='flex items-center justify-between pb-2 border-b border-gray-100'>
                                    <span className='font-bold text-gray-800'>Filters & Sort</span>
                                    <button onClick={() => setMobileSidebar(false)} className='text-gray-400 hover:text-gray-700'>
                                        <FiX size={20} />
                                    </button>
                                </div>
                                <SidebarContent />
                                <button
                                    onClick={() => setMobileSidebar(false)}
                                    className='mt-auto py-3 rounded-xl text-white font-bold text-sm transition-all hover:scale-105'
                                    style={{ background: `linear-gradient(135deg, ${ACCENT}, ${PRIMARY})` }}
                                >
                                    Show {filtered.length} Results
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Product grid ── */}
                    <div className='flex-1 min-w-0'>

                        {paginated.length > 0 ? (
                            <>
                                <div className='flex flex-wrap justify-center gap-6 sm:gap-8'>
                                    {paginated.map((item, i) => (
                                        <div
                                            key={item._id ?? i}
                                            className='w-full sm:w-full md:w-1/2 lg:w-1/3 animate-[fadeInUp_0.3s_ease-out_both]'
                                            style={{ animationDelay: `${i * 30}ms` }}
                                        >
                                            <FoodCard data={item} />
                                        </div>
                                    ))}
                                </div>

                                {/* Result info */}
                                <p className='text-xs text-gray-400 text-center mt-6'>
                                    Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} results
                                </p>

                                <Pagination
                                    total={filtered.length}
                                    perPage={ITEMS_PER_PAGE}
                                    current={page}
                                    onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                                />
                            </>
                        ) : (
                            /* Empty state */
                            <div className='flex flex-col items-center justify-center gap-4 py-20 bg-white rounded-2xl'>
                                <span className='text-6xl'>🔍</span>
                                <h2 className='text-xl font-bold text-gray-700'>No results found</h2>
                                <p className='text-sm text-gray-400 text-center max-w-xs'>
                                    Try adjusting your filters or search for something else.
                                </p>
                                {activeFilters > 0 && (
                                    <button
                                        onClick={clearAll}
                                        className='px-5 py-2 rounded-xl text-white text-sm font-bold transition-all hover:scale-105'
                                        style={{ background: `linear-gradient(135deg, ${ACCENT}, ${PRIMARY})` }}
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Active filter chips — sticky bottom on mobile */}
            {activeFilters > 0 && (
                <div className='sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-2 overflow-x-auto z-50 shadow-lg'>
                    {selCats.map(c => (
                        <span
                            key={c}
                            onClick={() => toggleCat(c)}
                            className='shrink-0 flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer'
                            style={{ background: `${PRIMARY}15`, color: PRIMARY }}
                        >
                            {c} <FiX size={11} />
                        </span>
                    ))}
                    {sort !== 'relevance' && (
                        <span
                            onClick={() => setSort('relevance')}
                            className='shrink-0 flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer'
                            style={{ background: `${ACCENT}15`, color: ACCENT }}
                        >
                            {SORT_OPTIONS.find(o => o.value === sort)?.label} <FiX size={11} />
                        </span>
                    )}
                </div>
            )}

            <Footer />

        </div>
    )
}

export default SearchResults
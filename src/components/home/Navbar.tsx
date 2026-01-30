import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100'>
      <div className='w-full flex items-center justify-between px-6 md:px-10 h-20'>
        {/* Logo Section */}
        <a href='#' className='flex items-center gap-2 group cursor-pointer'>
          <div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg transition-transform group-hover:scale-105'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='22'
              height='22'
              viewBox='0 0 24 24'
              fill='none'
              stroke='white'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M3 3v18h18' />
              <path d='M18.7 8l-5.1 5.2-2.8-2.7L7 14.3' />
            </svg>
          </div>
          <span className='font-outfit font-bold text-lg text-primary tracking-tight hidden sm:inline-block'>
            FinanceAI
          </span>
        </a>

        {/* Navigation Links - Centered */}
        <nav className='hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2'>
          {[
            { name: 'About us', href: '#footer' },
            { name: 'Our Mission', href: '#solution' },
            { name: 'Features', href: '#features' },
            { name: 'Contact', href: '#contact' }
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-primary font-medium text-[14.5px] transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all hover:after:w-full"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className='flex items-center gap-2 md:gap-3'>
          <Button
            onClick={() => navigate('/register')}
            variant='outline'
            className='border-primary text-primary hover:bg-primary/5 px-4 md:px-6 h-10 md:h-11 rounded-md font-semibold text-xs md:text-sm transition-all'
          >
            Register
          </Button>
          <Button
            onClick={() => navigate('/login')}
            className='bg-[#2A4069] hover:bg-primary-dark text-white px-5 md:px-8 h-10 md:h-11 rounded-md font-semibold text-xs md:text-sm transition-all shadow-md active:scale-95'
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Navbar

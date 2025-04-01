import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Tabs() {
  const location = useLocation();

  return (
    <div className="flex border-b mb-6">
      {['/', '/custom'].map((path, index) => (
        <Link to={path} key={path} className="relative px-6 py-3 text-gray-500">
          <span className={location.pathname === path ? 'text-cyan-600 font-semibold' : ''}>
            {index === 0 ? 'Default Summarization' : 'Custom Summarization'}
          </span>
          {location.pathname === path && (
            <motion.div
              className="absolute bottom-0 left-0 w-full h-1 bg-cyan-600"
              layoutId="underline"
            />
          )}
        </Link>
      ))}
    </div>
  );
}

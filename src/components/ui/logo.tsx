import { HeartHandshake } from 'lucide-react';

const Logo = () => {
    return (
      <div className='flex gap-3 items-center'>
            <HeartHandshake size={48} color='var(--primary)' strokeWidth={1.25}/>
            <h1 className="text-2xl font-bold text-foreground">LifeHack</h1>
      </div>
    );
};

export default Logo;
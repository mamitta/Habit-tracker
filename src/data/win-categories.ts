export type WinCategory={
    id: string;
  title: string;
  color: string;
  bgColor: string;


}




export const winCategories: WinCategory[] = [
    {
      id: 'mental',
      title: 'Mental',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    {
      id: 'physical',
      title: 'Physical',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    {
      id: 'spiritual',
      title: 'Spiritual',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    {
      id: 'accountability',
      title: 'Accountability',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    }
  ];
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
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'physical',
      title: 'Physical',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'spiritual',
      title: 'Spiritual',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 'accountability',
      title: 'Accountability',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];
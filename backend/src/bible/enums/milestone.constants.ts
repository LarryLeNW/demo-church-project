export interface SpiritualMilestone {
  id: string;
  title: string;
  englishTitle: string;
  requiredDays: number;
  scripture: string;
  scriptureRef: string;
  description: string;
  icon: string;
}

export const SPIRITUAL_MILESTONES: SpiritualMilestone[] = [
  {
    id: 'beginner_3d',
    title: 'Chiên Thơ Khởi Đầu',
    englishTitle: 'Beginning Lamb',
    requiredDays: 3,
    scripture: 'Đức Giê-hô-va là Đấng chăn giữ tôi, tôi chẳng thiếu thốn gì.',
    scriptureRef: 'Thi Thiên 23:1',
    description: 'Bắt đầu hành trình tĩnh nguyện trung tín cùng Chúa qua 3 ngày liên tục.',
    icon: 'Flame',
  },
  {
    id: 'planted_by_water_7d',
    title: 'Cây Trồng Gần Dòng Nước',
    englishTitle: 'Planted by Streams of Water',
    requiredDays: 7,
    scripture: 'Người ấy sẽ như cây trồng gần dòng nước, sanh bông trái theo thì tiết, lá cũng chẳng tàn héo.',
    scriptureRef: 'Thi Thiên 1:3',
    description: '1 tuần lễ trọn vẹn no nê Lời Hằng Sống của Đức Chúa Trời.',
    icon: 'Sprout',
  },
  {
    id: 'lamp_to_feet_14d',
    title: 'Ngọn Đèn Cho Chân Tôi',
    englishTitle: 'A Lamp to My Feet',
    requiredDays: 14,
    scripture: 'Lời Chúa là ngọn đèn cho chân tôi, ánh sáng cho đường lối tôi.',
    scriptureRef: 'Thi Thiên 119:105',
    description: '2 tuần liên tục bước đi theo sự soi dẫn và ánh sáng của Lời Chúa.',
    icon: 'Sun',
  },
  {
    id: 'walking_with_christ_30d',
    title: 'Đồng Đi Cùng Đấng Christ',
    englishTitle: 'Walking with Christ',
    requiredDays: 30,
    scripture: 'Ví bằng chúng ta bước đi trong sự sáng cũng như chính mình Ngài ở trong sự sáng, thì chúng ta được thông công cùng nhau.',
    scriptureRef: '1 Giăng 1:7',
    description: '1 tháng bền đỗ thông công và kết hiệp tâm linh cùng Cứu Chúa Jesus.',
    icon: 'Footprints',
  },
  {
    id: 'pillar_in_temple_100d',
    title: 'Cột Trụ Trong Nhà Chúa',
    englishTitle: 'Pillar in God\'s Temple',
    requiredDays: 100,
    scripture: 'Kẻ nào thắng, ta sẽ cho làm trụ trong đền của Đức Chúa Trời ta, và người sẽ không ra khỏi đó nữa.',
    scriptureRef: 'Khải Huyền 3:12',
    description: '100 ngày kiên định, trở nên trụ cột đức tin vững chãi của Hội Thánh.',
    icon: 'Crown',
  },
];

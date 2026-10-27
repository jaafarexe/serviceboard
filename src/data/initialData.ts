import { ServiceRequest } from '../types.ts';
import { getTodayString, getRelativeDateString } from '../utils/dateUtils.ts';

export function getInitialRequests(): ServiceRequest[] {
  const today = getTodayString();
  const tomorrow = getRelativeDateString(1);
  const now = Date.now();

  return [
    {
      id: 'req-example-1',
      customerName: 'Elena Rostova',
      phone: '(555) 234-8901',
      email: 'elena.rostova@example.com',
      serviceType: 'Comprehensive Bike Tune-up & Hydraulic Bleed',
      date: today,
      timeWindow: '09:00 - 11:00 AM',
      notes: 'Brakes feel spongy after winter storage. Inspect rear derailleur hanger alignment. Customer will pick up at 4:30 PM.',
      estimatedPrice: 125,
      priority: 'urgent',
      status: 'in_progress',
      createdAt: now - 1000 * 60 * 120, // 2 hours ago
      updatedAt: now - 1000 * 60 * 30,
    },
    {
      id: 'req-example-2',
      customerName: 'Marcus Vance',
      phone: '(555) 872-4419',
      email: 'm.vance@example.org',
      serviceType: 'Twin Golden Retrievers 1-Hour Park Walk',
      date: today,
      timeWindow: '01:30 - 02:30 PM',
      notes: 'Spare key is in the lockbox by the front porch (code 4821). Please towel dry their paws if the grass is wet.',
      estimatedPrice: 45,
      priority: 'normal',
      status: 'scheduled',
      createdAt: now - 1000 * 60 * 300, // 5 hours ago
      updatedAt: now - 1000 * 60 * 60,
    },
    {
      id: 'req-example-3',
      customerName: 'Clara Dupont',
      phone: '(555) 604-3298',
      email: 'clara.dupont@example.com',
      serviceType: 'Sourdough Loaves & Cardamom Brioche Catering',
      date: tomorrow,
      timeWindow: '10:00 - 11:30 AM',
      notes: 'Order for family Sunday brunch: 4 seeded country sourdough loaves and 12 Swedish cardamom brioche buns.',
      estimatedPrice: 90,
      priority: 'normal',
      status: 'new',
      createdAt: now - 1000 * 60 * 480, // 8 hours ago
      updatedAt: now - 1000 * 60 * 480,
    },
  ];
}

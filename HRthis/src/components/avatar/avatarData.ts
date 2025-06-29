import { AvatarAccessory } from '../../types/learning';

export const availableAccessories: AvatarAccessory[] = [
  {
    id: 'hat_graduation',
    type: 'hat',
    name: 'Absolventenhut',
    imageUrl: '/avatars/hats/graduation.png',
    requiredLevel: 5
  },
  {
    id: 'glasses_nerd',
    type: 'glasses',
    name: 'Nerd-Brille',
    imageUrl: '/avatars/glasses/nerd.png',
    price: 100
  },
  {
    id: 'glasses_cool',
    type: 'glasses',
    name: 'Sonnenbrille',
    imageUrl: '/avatars/glasses/sunglasses.png',
    price: 150
  },
  {
    id: 'clothing_suit',
    type: 'clothing',
    name: 'Business Anzug',
    imageUrl: '/avatars/clothing/suit.png',
    price: 300
  },
  {
    id: 'clothing_casual',
    type: 'clothing',
    name: 'Casual Outfit',
    imageUrl: '/avatars/clothing/casual.png',
    price: 200
  },
  {
    id: 'hat_cap',
    type: 'hat',
    name: 'Baseball Cap',
    imageUrl: '/avatars/hats/cap.png',
    price: 80
  },
  {
    id: 'badge_star',
    type: 'badge',
    name: 'Stern Badge',
    imageUrl: '/avatars/badges/star.png',
    requiredLevel: 10
  }
];

export const badgeData = [
  {
    id: 'badge_100_trainings',
    name: '100 Trainings',
    description: 'Schließe 100 Trainings ab',
    imageUrl: '/avatars/badges/100-trainings.png',
    earned: false
  },
  {
    id: 'badge_perfect_month',
    name: 'Perfekter Monat',
    description: '30 Tage in Folge gelernt',
    imageUrl: '/avatars/badges/perfect-month.png',
    earned: true
  },
  {
    id: 'badge_team_player',
    name: 'Team Player',
    description: 'Hilf 10 Kollegen',
    imageUrl: '/avatars/badges/team-player.png',
    earned: true
  }
];
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/responseUtil.js';
import { validateIdentifier } from '../utils/validatorUtil.js';

let localNotifications = [
  {
    id: 'notif-001',
    title: 'Time to review JavaScript Closures',
    message: 'Your scheduled spaced repetition review for Closures is due today.',
    type: 'reminder',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'notif-002',
    title: 'Quiz Accuracy Milestone Reached! 🎯',
    message: 'Your accuracy in React.js improved by 14% over your last 3 attempts.',
    type: 'achievement',
    is_read: false,
    created_at: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: 'notif-003',
    title: 'New Adaptive Challenge Available',
    message: 'A fresh challenge on Libuv Event Loop Architecture is waiting for you.',
    type: 'info',
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

export async function getNotifications(req, res) {
  const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const unreadCount = data.filter(n => !n.is_read).length;
        return sendSuccess(res, { notifications: data, unreadCount });
      }
    } catch (err) {
      console.warn('[Get Notifications Error]', err.message);
    }
  }

  const unreadCount = localNotifications.filter(n => !n.is_read).length;
  return sendSuccess(res, { notifications: localNotifications, unreadCount });
}

export async function markAsRead(req, res) {
  const { id } = req.params;
  const validation = validateIdentifier(id, 'Notification ID');
  if (!validation.isValid) {
    return sendError(res, validation.message, 400);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    } catch (err) {
      console.warn('[Mark Notification Error]', err.message);
    }
  }

  localNotifications = localNotifications.map(n => n.id === id ? { ...n, is_read: true } : n);
  return sendSuccess(res, { id, is_read: true }, 'Notification marked as read');
}

export async function markAllAsRead(req, res) {
  const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId);
    } catch (err) {
      console.warn('[Mark All Read Error]', err.message);
    }
  }

  localNotifications = localNotifications.map(n => ({ ...n, is_read: true }));
  return sendSuccess(res, { success: true }, 'All notifications marked as read');
}

export async function deleteNotification(req, res) {
  const { id } = req.params;
  const validation = validateIdentifier(id, 'Notification ID');
  if (!validation.isValid) {
    return sendError(res, validation.message, 400);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('notifications').delete().eq('id', id);
    } catch (err) {
      console.warn('[Delete Notification Error]', err.message);
    }
  }

  localNotifications = localNotifications.filter(n => n.id !== id);
  return sendSuccess(res, { id, deleted: true }, 'Notification deleted');
}

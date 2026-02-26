import { useCallback } from 'react';
import { useAppStore } from '../../frontend/src/store/appStore';
import { ztDelete, ztGet, ztPost } from '../api/ztApi';
import { useToastQueue } from '../components/ui/Toast';

interface MemberLike {
  ipAssignments?: string[];
  [key: string]: unknown;
}

export function useMembers() {
  const { toast } = useToastQueue();
  const host = useAppStore((s) => s.host);
  const token = useAppStore((s) => s.token);
  const selectedNwid = useAppStore((s) => s.selectedNwid);
  const memberIps = useAppStore((s) => s.memberIps);
  const setMemberIps = useAppStore((s) => s.setMemberIps);

  const apiCtx = { host, token, onNetworkError: (message: string) => toast(message, 'err') };

  const loadMembers = useCallback(async (nwid = selectedNwid) => {
    if (!nwid) {
      toast('Enter a Network ID first', 'err');
      return null;
    }

    return ztGet(`/controller/network/${nwid}/member`, apiCtx);
  }, [apiCtx, selectedNwid, toast]);

  const loadMember = useCallback(async (nwid: string, memid: string) => {
    const res = await ztGet<MemberLike>(`/controller/network/${nwid}/member/${memid}`, apiCtx);
    if (res?.ok) {
      setMemberIps(res.data?.ipAssignments || []);
    }
    return res;
  }, [apiCtx, setMemberIps]);

  const saveMember = useCallback(async (nwid: string, memid: string, body: Record<string, unknown>) => {
    const mergedBody = { ...body, ipAssignments: memberIps };
    const res = await ztPost(`/controller/network/${nwid}/member/${memid}`, apiCtx, mergedBody);
    if (res?.ok) toast('Member saved', 'ok');
    return res;
  }, [apiCtx, memberIps, toast]);

  const deleteMember = useCallback(async (nwid: string, memid: string) => {
    await ztPost(`/controller/network/${nwid}/member/${memid}`, apiCtx, { authorized: false });
    const res = await ztDelete(`/controller/network/${nwid}/member/${memid}`, apiCtx);
    if (res?.ok) toast('Member deleted', 'ok');
    return res;
  }, [apiCtx, toast]);

  return { loadMembers, loadMember, saveMember, deleteMember };
}

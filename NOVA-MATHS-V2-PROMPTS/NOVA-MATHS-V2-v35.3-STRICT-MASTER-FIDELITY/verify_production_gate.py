#!/usr/bin/env python3
"""NOVA v35.2 evidence gate. Checks declared evidence, NOT the truth of browser/math outcomes."""
import argparse, json
from pathlib import Path

REQUIRED_INTERNAL = ['curriculum_full_coverage', 'teaching_content_all_populated', 'source_hashes_and_template_shell', 'correct_answers_all_bank_items', 'native_visual_semantics_all_bank_items', 'visual_answer_concealment', 'bob_all_beats_playback_skip_stop', 'keyword_pills_all_keyboard', 'watch_all_steps_play_pause_seek', 'guided_all_steps_play_reset', 'explore_each_concept_start_change_reset', 'f012_full_bank_rendering', 'f012_six_round_end_to_end', 'f012_seven_round_end_to_end', 'f012_eight_round_end_to_end', 'f012_wrong_lives_hints_replay_isolation', 'assessment_all_items_visuals', 'assessment_marking_and_storage', 'tts_callbacks_and_cancellation', 'viewport_all_stages_390_768_1024_1440', 'keyboard_and_reduced_motion', 'offline_resources_no_errors', 'post_patch_regression_suite']
DEVICE_ONLY = ['heard_tts_entire_lesson', 'normal_windows_local_open_save_reload', 'physical_touch_drag_all_controls']

def main():
 p=argparse.ArgumentParser();p.add_argument('manifest');p.add_argument('--root',default='.');ns=p.parse_args()
 root=Path(ns.root).resolve(); m=json.loads(Path(ns.manifest).read_text(encoding='utf-8')); errors=[]; device=[]
 if m.get('schema')!='NOVA-MATHS-PRODUCTION-GATE-v35.2':errors.append('Wrong production gate schema')
 if not m.get('lessonId'):errors.append('Missing lessonId')
 if m.get('run') != 4:errors.append('Gate is for run 4')
 expect=m.get('expected',{}); observed=m.get('observed',{})
 for key in ['concepts','challenge_per_concept','total_challenge','bob_beats','watch_steps','guided_steps','start_questions','practice_questions','exit_questions']:
  if key not in expect or key not in observed or observed[key] is None: errors.append('Missing measured coverage: '+key)
  elif isinstance(expect.get(key),int) and observed[key] != expect[key]:errors.append('Count mismatch: '+key+' expected '+str(expect[key])+' got '+str(observed[key]))
  elif isinstance(expect.get(key),str) and (not isinstance(observed[key],int) or observed[key]<1):errors.append('Expected positive observed count for '+key)
 def file_ok(path):
  if not isinstance(path,str) or not path.strip():return False
  candidate=(root/path).resolve()
  return candidate.is_relative_to(root) and candidate.is_file() and candidate.stat().st_size > 0
 if not file_ok(m.get('complete_state_inventory_path')):errors.append('Missing all-state inventory evidence file')
 checks=m.get('checks',{})
 for key in REQUIRED_INTERNAL + DEVICE_ONLY:
  v=checks.get(key)
  if not isinstance(v,dict):errors.append('Missing check '+key);continue
  status=v.get('status','UNVERIFIED')
  if key in REQUIRED_INTERNAL and status!='PASS': errors.append(key+' = '+status+' (requires PASS)')
  elif key in DEVICE_ONLY and status=='DEVICE_PENDING':device.append(key)
  elif key in DEVICE_ONLY and status!='PASS':errors.append(key+' = '+status+' (must PASS or DEVICE_PENDING)')
  if status=='PASS':
   if not v.get('method') or not v.get('scope') or not v.get('observed'):errors.append('PASS needs method/scope/observed: '+key)
   evidence=v.get('evidence_paths',[])
   if not evidence or not all(file_ok(e) for e in evidence):errors.append('PASS evidence file missing/empty/outside root: '+key)
 if device and not file_ok(m.get('year_audit_register_path')):errors.append('Device checks pending but year audit register file missing')
 if device and m.get('status')!='INTERNAL-QA-PASSED / DEVICE-SIGNOFF-PENDING':errors.append('Status must be INTERNAL-QA-PASSED / DEVICE-SIGNOFF-PENDING; never call it GOLD')
 if not device and m.get('status') not in ['READY-FOR-OWNER-APPROVAL','GOLD-OWNER-APPROVED']:errors.append('Status must be READY-FOR-OWNER-APPROVAL, not an unreviewed GOLD claim')
 if errors:
  print('BLOCKED-NOT-COMPLETE — '+str(len(errors))+' gate issue(s)')
  for i in errors:print('  - '+i)
  return 2
 if device:
  print('INTERNAL-QA-PASSED / DEVICE-SIGNOFF-PENDING; NOT GOLD')
  for i in device:print('  - device pending: '+i)
  return 0
 print('EVIDENCE-DOCUMENTATION-COMPLETE. GOLD still requires semantic/device/owner verification; script cannot certify GOLD.')
 return 0

if __name__=='__main__':raise SystemExit(main())

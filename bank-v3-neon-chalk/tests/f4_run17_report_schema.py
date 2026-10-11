"""Strict F4 QA report normalizer. No external dependencies.

Handles both report structures used in the canonical F4 runs:
- {'checks': [...], 'tests': N, 'pass': N, 'fail': 0}
- {'checks': N, 'details': [...], 'passed': N, 'failed': 0}
- {'results': [...], 'passed': N, 'failed': 0}
A malformed or contradictory report ALWAYS fails closed.
"""

def _nonnegative_integer(x):
    return type(x) is int and x >= 0


def _count(d, keys):
    for key in keys:
        v = d.get(key)
        if _nonnegative_integer(v):
            return v
        if isinstance(v, list):
            return len(v)
    return None


def normalize_report(data, name='QA report'):
    if not isinstance(data, dict):
        raise ValueError(f'{name}: expected JSON object')
    detail = next((data[k] for k in ('checks', 'details', 'results', 'tests')
                   if isinstance(data.get(k), list)), None)
    total = _count(data, ('total', 'tests', 'checks'))
    if total is None and detail is not None:
        total = len(detail)
    passed = _count(data, ('passed', 'pass'))
    failed = _count(data, ('failed', 'fail'))
    if detail is not None:
        if not all(isinstance(case, dict) and type(case.get('passed')) is bool for case in detail):
            raise ValueError(f'{name}: evidence items must have boolean passed status')
        evidence_passed = sum(case['passed'] for case in detail)
        evidence_failed = len(detail) - evidence_passed
        if total is None:
            total = len(detail)
        if total != len(detail):
            raise ValueError(f'{name}: declared {total} checks but evidence has {len(detail)}')
        if passed is None:
            passed = evidence_passed
        if failed is None:
            failed = evidence_failed
        if passed != evidence_passed or failed != evidence_failed:
            raise ValueError(f'{name}: summary conflicts with individual check evidence')
    if total is None or total == 0:
        raise ValueError(f'{name}: no positive declared test count')
    if passed is None and failed is not None:
        passed = total - failed
    if failed is None and passed is not None:
        failed = total - passed
    if not (_nonnegative_integer(passed) and _nonnegative_integer(failed)):
        raise ValueError(f'{name}: missing valid pass/fail counts')
    if passed + failed != total:
        raise ValueError(f'{name}: {passed} passes + {failed} failures != {total} total')
    return {'total': total, 'passed': passed, 'failed': failed,
            'evidence_cases': len(detail) if detail is not None else 0,
            'passed_all': failed == 0 and passed == total}

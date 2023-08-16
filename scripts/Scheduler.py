import schedule
import time


class Scheduler:

    def __init__(self):
        self.jobs = schedule.default_scheduler.jobs

    def schedule_task(self, job_func, job_interval, job_period):
        if job_period == 'seconds':
            schedule.every(job_interval).seconds.do(job_func)
        elif job_period == 'minutes':
            schedule.every(job_interval).minutes.do(job_func)
        elif job_period == 'hours':
            schedule.every(job_interval).hours.do(job_func)
        elif job_period == 'days':
            schedule.every(job_interval).days.do(job_func)
        elif job_period == 'weeks':
            schedule.every(job_interval).weeks.do(job_func)
        else:
            print('Invalid job period')

    def retrieve_info(self):
        for job in self.jobs:
            print(job)
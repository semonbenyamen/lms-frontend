export type Course = {
  id: number
  title: string
  instructor: string
}

let courses: Course[] = [
  {
    id: 1,
    title: 'React Basics',
    instructor: 'Ahmed',
  },
  {
    id: 2,
    title: 'TypeScript Fundamentals',
    instructor: 'Sara',
  },
  {
    id: 3,
    title: 'NestJS Backend',
    instructor: 'Omar',
  },
]

export async function fetchCourses(): Promise<Course[]> {
  return courses
}

export async function createCourse(
  newCourse: Omit<Course, 'id'>,
): Promise<Course> {
  const course: Course = {
    id: Date.now(),
    ...newCourse,
  }

  courses = [...courses, course]

  return course
}
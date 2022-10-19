import { useRef, useCallback } from 'react'

const useInfiniteScroll = (callback, isFetching) => {
  //use useRef to store a DOM node and the returned object will persist regardless of re-renders
  const observer = useRef<any>()

  //useCallback takes a callback argument and an array dependency list and returns a memoized callback
  //which is guaranteed to have the same reference
  const lastElementRef = useCallback(
    (node) => {
      if (isFetching) return

      //stop watching targets, think of it as a reset
      if (observer.current) observer.current.disconnect()

      //create a new intersection observer and execute the callback incase of an intersecting event
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          callback()
        }
      })

      //if there is a node, let the intersection observer watch that node
      if (node) observer.current.observe(node)
    },
    [callback, isFetching]
  )

  //return reference to the last element
  return [lastElementRef]
}

/* import { useState, useEffect, useCallback } from 'react'

 const useInfiniteScroll = (loadMore, hasMoreItems) => {
  const [isLoading, setLoading] = useState(false)

  const handleScroll = useCallback(() => {
    if (!document.documentElement) {
      return
    }
    const getScrollTop = () => {
      const el = document.scrollingElement || document.documentElement
      return el ? el.scrollTop : 0
    }
 
    const scrollTopValue = window.innerHeight + getScrollTop()
    const offsetHeight = document.documentElement
      ? document.documentElement.offsetHeight
      : 0
    const hasEndReached = Math.ceil(scrollTopValue) === offsetHeight
    if (hasEndReached && !isLoading && hasMoreItems) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [hasMoreItems, isLoading])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (isLoading) {
      loadMore()
    }
  }, [isLoading, loadMore])

  return [isLoading, setLoading]
} */

export default useInfiniteScroll

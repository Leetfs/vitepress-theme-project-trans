<script setup lang="ts">
import { useData } from 'vitepress'
import { ref, watch } from 'vue'

// 获取页面数据
const { frontmatter, attrs } = useData()

// 响应式变量
const enableCopyright = ref(attrs?.copyright?.enable ?? false)

// 检查是否至少有一个作者
const hasAuthors = ref(attrs?.author?.length > 0)

// 监听 frontmatter 的变化
watch(() => frontmatter.value, () => {
  enableCopyright.value = attrs?.copyright?.enable ?? false
  hasAuthors.value = attrs?.author?.length > 0
})

</script>

<template>
  <div v-if="enableCopyright && hasAuthors">
    <div class="tip custom-block">
      <p class="custom-block-title">Copyright</p>
      <p>
        <span>这篇文章 </span>
        <a v-if="frontmatter.originUrl" :href="frontmatter.originUrl">{{ frontmatter.title }}</a>
        <span v-else>{{ frontmatter.title }}</span>
        <span> 由 </span>
        <span v-for="author in attrs?.author" :key="author">{{ author }}<span v-if="!$last">、</span></span>
        <span> 创作</span>
        <span v-if="frontmatter.license">
          <span>，Project Trans 在 </span>
          <span>{{ frontmatter.license }}</span>
          <span> 许可下使用</span>
        </span>
        <span>。</span>
      </p>
    </div>
    <hr>
  </div>
</template>

<div align=center>
  <h1>&#9889;<br>Jolt</h1>
  <p>Reactive Javascript Utility Framework</p>
  <a href='https://github.com/electrikmilk/jolt/wiki'>Docs</a>
</div>

## DO

- Be easy to learn
- Keep things simple
- Memorable APIs
- Create abstractions that make life easier for the developer
- Use dependencies only when absolutely necessary

## DON'T

- Add unnecessary bloat that a few devs will use (DIY!)
- Create the next fully featured framework for huge websites
- Create unnecessarily complex abstractions, APIs, and tools
- Add bloating, unnecessary, needlessly complex dependencies

# Build

Jolt is not only written in TypeScript, but in multiple files and directories in /src/ to keep development organized. Therefore, it must be combined and compiled. Either of these commands will create a /build/ directory.

Compile to create `build/jolt.js`:

```console
tsc
```

**OR**

Compile and minify to create `build/jolt.min.js`:

```console
php jolt build
```

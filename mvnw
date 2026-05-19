#!/bin/sh
set -euf

basedir=$(cd "$(dirname "$0")" && pwd -P)
wrapperJarPath="$basedir/.mvn/wrapper/maven-wrapper.jar"
wrapperPropertiesPath="$basedir/.mvn/wrapper/maven-wrapper.properties"

if [ ! -f "$wrapperPropertiesPath" ]; then
  echo "maven-wrapper.properties not found: $wrapperPropertiesPath" >&2
  exit 1
fi

if [ ! -f "$wrapperJarPath" ]; then
  wrapperUrl=$(sed -n 's/^wrapperUrl=//p' "$wrapperPropertiesPath")
  [ -z "$wrapperUrl" ] && wrapperUrl="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar"

  if command -v curl >/dev/null 2>&1; then
    curl -fsSL -o "$wrapperJarPath" "$wrapperUrl"
  elif command -v wget >/dev/null 2>&1; then
    wget -q -O "$wrapperJarPath" "$wrapperUrl"
  else
    echo "Error: neither curl nor wget found for wrapper download." >&2
    exit 1
  fi
fi

if [ -n "${JAVA_HOME-}" ] && [ -x "$JAVA_HOME/bin/java" ]; then
  JAVA_EXEC="$JAVA_HOME/bin/java"
else
  JAVA_EXEC=java
fi

exec "$JAVA_EXEC" \
  -classpath "$wrapperJarPath" \
  "-Dmaven.multiModuleProjectDirectory=$basedir" \
  org.apache.maven.wrapper.MavenWrapperMain "$@"
